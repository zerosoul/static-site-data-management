import React from "react";
import { Query, Mutation } from "react-apollo";
import { Table, Button, message, Popconfirm, Tag, Badge } from "antd";
import moment from "moment";
import styled from "styled-components";
import { ListQuery, RemoveUser, UpdateUser } from "./actions.gql";

const VerticalCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > span {
    margin-top: 0.4rem;
  }
`;
export default function List({
  handleModalVisible,
  retriveValues,
  updateRetriveValues
}) {
  const { page: currPage } = retriveValues;
  const columns = [
    {
      title: "用户名",
      dataIndex: "name",
      key: "name",
      width: 200
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: 220
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      key: "mobile",
      width: 220,
      render: m => (m ? m : <span>暂无</span>)
    },
    {
      title: "角色/创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (d, { role }) => (
        <VerticalCell>
          <Tag color={role == 1 ? "green" : "#f50"}>
            {role == 1 ? "管理员" : "运营"}
          </Tag>
          <span>{moment(new Date(+d)).format("YYYY/MM/DD HH:mm:ss")}</span>
        </VerticalCell>
      )
    },
    {
      title: "操作",
      dataIndex: "options",
      key: "options",
      width: 240,
      render: (d, item) => {
        const { _id, isTop } = item;
        return (
          <Button.Group size="small">
            <Button
              onClick={() => {
                console.log("curr id", _id);

                handleModalVisible(true, _id);
              }}
            >
              编辑
            </Button>
            <Mutation
              mutation={RemoveUser}
              refetchQueries={() => {
                return [{ query: ListQuery }];
              }}
            >
              {(removeUser, { data, loading, err }) => {
                if (err) {
                  message.error("删除出错了");
                }
                if (data && data.title) {
                  message.success("删除成功");
                }
                return (
                  <Popconfirm
                    okText="确定"
                    cancelText="取消"
                    onConfirm={async () => {
                      await removeUser({
                        variables: { uid: _id }
                      });
                    }}
                    title="确定删除？"
                  >
                    <Button loading={loading} type="danger">
                      删除
                    </Button>
                  </Popconfirm>
                );
              }}
            </Mutation>
            <Mutation
              mutation={UpdateUser}
              refetchQueries={[{ query: ListQuery, variables: retriveValues }]}
            >
              {(updateUser, { data, loading, err }) => {
                if (err) {
                  message.error("操作出错了");
                }
                if (data && data.title) {
                  message.success("操作成功");
                }
                return (
                  <Popconfirm
                    okText="确定"
                    cancelText="取消"
                    onConfirm={async () => {
                      await updateUser({
                        variables: { id: _id, isTop: !isTop }
                      });
                    }}
                    title={isTop ? "确定撤顶？" : "确定置顶？"}
                  >
                    <Button loading={loading}>
                      {isTop ? "撤顶" : "置顶"}
                      {isTop && (
                        <Badge
                          style={{ marginLeft: "8px" }}
                          color="#f50"
                          status="processing"
                          dot={true}
                        />
                      )}
                    </Button>
                  </Popconfirm>
                );
              }}
            </Mutation>
          </Button.Group>
        );
      }
    }
  ];
  handleModalVisible.bind(columns);
  return (
    <Query
      query={ListQuery}
      variables={{ ...retriveValues }}
      notifyOnNetworkStatusChange={true}
    >
      {({ loading, error, data = {}, networkStatus }) => {
        if (error) return `Error! ${error.message}`;
        console.log("table loading", loading, networkStatus);

        return (
          <Table
            bordered={true}
            size="middle"
            rowKey={"_id"}
            columns={columns}
            dataSource={data.users && data.users.list}
            loading={loading}
            pagination={{
              current: currPage,
              onChange: page => {
                console.log("page change", page);
                updateRetriveValues({ ...retriveValues, page });
                document
                  .querySelector("#mainBlock")
                  .scrollIntoView({ behavior: "smooth" });
              },

              size: "small",
              pageSize: 10,
              total: data.users && data.users.total,
              showTotal: total => {
                return `共${total}条`;
              }
            }}
          />
        );
      }}
    </Query>
  );
}
