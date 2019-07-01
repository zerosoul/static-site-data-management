import React, { useEffect } from "react";
import { Query, Mutation } from "react-apollo";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Badge,
  Row,
  Col
} from "antd";
import moment from "moment";
import styled from "styled-components";
import { ListQuery, RemoveCode, UpdateCode } from "./actions.gql";

const VerticalCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > span {
    margin-top: 0.4rem;
  }
`;
export default function List({ handleModalVisible }) {
  const columns = [
    {
      title: "Code码",
      dataIndex: "value",
      key: "value",
      width: 200
    },
    {
      title: "使用情况",
      dataIndex: "used",
      key: "used",
      width: 220,
      render: used => {
        return used ? "已使用" : "未使用";
      }
    },
    {
      title: "对应角色",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: role => {
        return role == 1 ? "管理员" : "运营人员";
      }
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
              mutation={RemoveCode}
              refetchQueries={result => {
                return [{ query: ListQuery }];
              }}
            >
              {(removeCode, { data, loading, err }) => {
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
                      const resp = await removeCode({
                        variables: { codeId: _id }
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
          </Button.Group>
        );
      }
    }
  ];
  handleModalVisible.bind(columns);
  return (
    <Query
      query={ListQuery}
      fetchPolicy="network-only"
      notifyOnNetworkStatusChange={true}
      partialRefetch
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
            dataSource={data.codes}
            loading={loading}
            pagination={{
              size: "small",
              pageSize: 10,
              total: data.codes && data.codes.length
            }}
          />
        );
      }}
    </Query>
  );
}
