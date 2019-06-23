import React from "react";
import styled from "styled-components";

const Wrapper = styled.ul`
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: 40rem;
  max-width: 90%;

  .bookings__item {
    margin: 0.5rem 0;
    padding: 0.5rem;
    border: 1px solid #5101d1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const bookingList = props => (
  <Wrapper>
    {props.bookings.map(booking => {
      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {booking.event.title} -{" "}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className="bookings__item-actions">
            <button
              className="btn"
              onClick={props.onDelete.bind(this, booking._id)}
            >
              Cancel
            </button>
          </div>
        </li>
      );
    })}
  </Wrapper>
);

export default bookingList;
