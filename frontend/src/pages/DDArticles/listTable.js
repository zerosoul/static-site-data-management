import React from "react";
import { Query, Mutation } from "react-apollo";
import { Table, Button, message, Popconfirm, Tag, Badge } from "antd";
import moment from "moment";
import styled from "styled-components";
import { ListQuery, RemoveDdArticle, UpdateDdArticle } from "./actions.gql";

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
  // const [currPage, setCurrPage] = useState(1);
  const { page: currPage } = retriveValues;
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 200
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 220
    },
    {
      title: "缩略图",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 220,
      render: (img, { link }) =>
        // <Tooltip placement="top" title={link}>

        img ? (
          <a
            href={link}
            target="_blank"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            <img style={{ maxWidth: "8rem" }} src={img} alt={link} />
          </a>
        ) : (
          <span>暂无缩略图</span>
        )

      // </Tooltip>
    },
    {
      title: "类型/发表时间",
      dataIndex: "date",
      key: "date",
      width: 200,
      render: (d, { type }) => (
        <VerticalCell>
          <Tag color={type == 1 ? "green" : "#f50"}>
            {type == 1 ? "新闻稿" : "点滴人物"}
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
              refetchQueries={[{ query: ListQuery, variables: retriveValues }]}
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
            dataSource={data.ddArticles && data.ddArticles.list}
            loading={loading}
            pagination={{
              current: currPage,
              onChange: page => {
                console.log("page change", page);
                updateRetriveValues({ ...retriveValues, page });
              },

              size: "small",
              pageSize: 10,
              total: data.ddArticles && data.ddArticles.total,
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
