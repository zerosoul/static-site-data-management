import React, { useEffect } from "react";
import { Query, Mutation } from "react-apollo";
import { Table, Button, message } from "antd";
import moment from "moment";
import styled from "styled-components";
import { ListQuery, RemoveDdArticle } from "./actions.gql";

const StyledLink = styled.a`
  max-width: 12rem;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
let refreshTable = () => {};
export default function List({ refresh = false, handleModalVisible }) {
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
            <Mutation mutation={RemoveDdArticle}>
              {(removeDdArticle, { data, loading, err }) => {
                if (err) {
                  message.error("删除出错了");
                }
                if (data && data.title) {
                  message.success("删除成功");
                }
                return (
                  <Button
                    loading={loading}
                    type="danger"
                    onClick={async () => {
                      const resp = await removeDdArticle({
                        variables: { artId: _id }
                      });
                      refreshTable();
                    }}
                  >
                    删除
                  </Button>
                );
              }}
            </Mutation>
          </Button.Group>
        );
      }
    }
  ];
  useEffect(() => {
    if (refresh) {
      refreshTable();
    }
  }, [refresh]);
  handleModalVisible.bind(columns);
  return (
    <Query fetchPolicy="network-only" query={ListQuery}>
      {({ loading, error, data, refetch }) => {
        if (error) return `Error! ${error.message}`;
        refreshTable = refetch;
        return (
          <Table
            rowKey={"_id"}
            columns={columns}
            dataSource={data.ddArticles}
            loading={loading}
            pagination={{
              size: "small",
              pageSize: 5,
              total: data && data.ddArticles && data.ddArticles.length
            }}
          />
        );
      }}
    </Query>
  );
}
