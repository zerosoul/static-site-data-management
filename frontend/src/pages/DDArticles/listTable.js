import React, { useEffect } from "react";
import { Query, Mutation } from "react-apollo";
import { Table, Button, message } from "antd";
import { ListQuery, RemoveDdArticle } from "./actions.gql";

let refreshTable = () => {};
export default function List({ refresh = false, handleModalVisible }) {
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "外链",
      dataIndex: "link",
      key: "link",
      render: l => {
        return (
          <a target="_blank" href={l}>
            {l}
          </a>
        );
      }
    },
    {
      title: "缩略图",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: img => (
        <>{img ? <img src={img} alt="缩略图" /> : <span>暂无</span>}</>
      )
    },
    {
      title: "创建时间",
      dataIndex: "date",
      key: "date",
      render: d => (
        <>
          <span>{new Date(+d).toLocaleDateString()}</span>
        </>
      )
    },
    {
      title: "操作",
      dataIndex: "options",
      key: "options",
      render: (d, item) => {
        const { _id } = item;
        return (
          <Button.Group size="small">
            <Button
              onClick={() => {
                handleModalVisible(true);
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
