import React from "react";
import { Query, Mutation } from "react-apollo";
import { Table, Button, message, Popconfirm } from "antd";
import moment from "moment";
import styled from "styled-components";
import { ListQuery, RemoveDdPosition } from "./actions.gql";

const StyledLink = styled.a`
  max-width: 12rem;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const List = ({ handleModalVisible }) => {
  const columns = [
    {
      title: "职位名称",
      dataIndex: "title",
      key: "title",
      width: 240
    },
    {
      title: "职位类别",
      dataIndex: "cate",
      key: "cate",
      width: 200
    },
    {
      title: "工作地点",
      dataIndex: "location",
      key: "location",
      width: 130
    },
    {
      title: "部门",
      dataIndex: "depart",
      key: "depart",
      width: 140
    },
    {
      title: "外链(拉钩/Boss等招聘链接)",
      dataIndex: "link",
      key: "link",
      width: 300,
      render: l => {
        return (
          <StyledLink target="_blank" href={l}>
            {l}
          </StyledLink>
        );
      }
    },

    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: d => (
        <>
          <span>{moment(new Date(+d)).format("YYYY/MM/DD HH:mm:ss")}</span>
        </>
      )
    },
    {
      title: "操作",
      dataIndex: "options",
      key: "options",
      width: 200,
      render: (d, item) => {
        const { _id } = item;
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
              mutation={RemoveDdPosition}
              refetchQueries={result => {
                return [{ query: ListQuery }];
              }}
            >
              {(removeDdPosition, { data, loading, err }) => {
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
                      const resp = await removeDdPosition({
                        variables: { posId: _id }
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
            dataSource={data.ddPositions}
            loading={loading || networkStatus == 4}
            pagination={{
              size: "small",
              pageSize: 10,
              total: data.DdPositions && data.DdPositions.length
            }}
          />
        );
      }}
    </Query>
  );
};
export default List;
