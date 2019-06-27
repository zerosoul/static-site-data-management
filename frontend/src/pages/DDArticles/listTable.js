import React, { useEffect } from "react";
import { Query, Mutation } from "react-apollo";
import { Table, Button, message, Popconfirm } from "antd";
import moment from "moment";
import styled from "styled-components";
import { ListQuery, RemoveDdArticle, UpdateDdArticle } from "./actions.gql";

const StyledLink = styled.a`
  max-width: 12rem;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export default function List({ handleModalVisible }) {
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 240
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 300
    },
    {
      title: "文章类型",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: type => {
        return type == 1 ? "新闻稿" : "点滴人物";
      }
    },
    {
      title: "外链",
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
      title: "缩略图",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: img => (
        <>
          {img ? (
            <img style={{ maxWidth: "8rem" }} src={img} alt="缩略图" />
          ) : (
            <span>暂无</span>
          )}
        </>
      )
    },
    {
      title: "发表时间",
      dataIndex: "date",
      key: "date",
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
              mutation={RemoveDdArticle}
              refetchQueries={result => {
                return [{ query: ListQuery }];
              }}
            >
              {(removeDdArticle, { data, loading, err }) => {
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
                      const resp = await removeDdArticle({
                        variables: { artId: _id }
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
              mutation={UpdateDdArticle}
              refetchQueries={result => {
                return [{ query: ListQuery }];
              }}
            >
              {(updateDdArticle, { data, loading, err }) => {
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
                      const resp = await updateDdArticle({
                        variables: { id: _id, isTop: !isTop }
                      });
                    }}
                    title={isTop ? "确定撤顶？" : "确定置顶？"}
                  >
                    <Button loading={loading}>{isTop ? "撤顶" : "置顶"}</Button>
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
            rowKey={"_id"}
            columns={columns}
            dataSource={data.ddArticles}
            loading={loading || networkStatus == 4}
            pagination={{
              size: "small",
              pageSize: 10,
              total: data.ddArticles && data.ddArticles.length
            }}
          />
        );
      }}
    </Query>
  );
}
