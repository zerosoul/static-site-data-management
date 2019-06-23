import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControls/BookingsControls";
const GET_BOOKINGS = gql`
  {
    bookings {
      _id
      createdAt
      event {
        _id
        title
        date
        price
      }
    }
  }
`;
let BOOKINGS = [];

class BookingsPage extends Component {
  static contextType = AuthContext;

  state = {
    isLoading: false,
    bookings: [],
    outputType: "list"
  };

  componentDidMount() {
    // this.fetchBookings();
  }

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: bookingId
      }
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(
            booking => booking._id !== bookingId
          );
          return { bookings: updatedBookings, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeOutputTypeHandler = outputType => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };

  render() {
    const TOKEN = localStorage.getItem("TOKEN");
    console.log("token", TOKEN);
    let content = (
      <>
        <BookingsControls
          activeOutputType={this.state.outputType}
          onChange={this.changeOutputTypeHandler}
        />
        <div>
          {this.state.outputType === "list" ? (
            <Query
              fetchPolicy="network-only"
              query={GET_BOOKINGS}
              context={{
                headers: {
                  Authorization: "Bearer " + TOKEN
                }
              }}
            >
              {({ loading, error, data }) => {
                if (loading) return <Spinner />;
                if (error) return `Error! ${error.message}`;
                BOOKINGS = data.bookings;
                return (
                  <BookingList
                    bookings={data.bookings}
                    onDelete={this.deleteBookingHandler}
                  />
                );
              }}
            </Query>
          ) : (
            <BookingsChart bookings={this.state.bookings} />
          )}
        </div>
      </>
    );

    return content;
  }
}

export default BookingsPage;
