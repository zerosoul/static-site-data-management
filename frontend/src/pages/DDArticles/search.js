import React from "react";
import { Button, Input, Form, Select } from "antd";

const { Item } = Form;
const { Option } = Select;
class FormItems extends React.Component {
  // 表单提交
  handleFormSubmit = evt => {
    evt.preventDefault();
    const { updateRetriveValues, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        console.log("search values", values);

        updateRetriveValues(values);
      }
    });
  };
  render() {
    const { form, resetRetriveValues } = this.props;

    return (
      <Form layout="inline" onSubmit={this.handleFormSubmit}>
        <Item>
          {form.getFieldDecorator("title")(<Input placeholder="文章标题" />)}
        </Item>
        <Item>
          {form.getFieldDecorator("type")(
            <Select placeholder="文章类型" style={{ width: 100 }}>
              <Option value="1">新闻稿</Option>
              <Option value="2">点滴人物</Option>
            </Select>
          )}
        </Item>

        <Item>
          <Button type="primary" icon="search" htmlType="submit">
            查询
          </Button>
        </Item>
        <Item>
          <Button
            icon="sync"
            onClick={() => {
              form.resetFields();
              resetRetriveValues();
            }}
          >
            重置
          </Button>
        </Item>
      </Form>
    );
  }
}

const Search = Form.create()(FormItems);
export default Search;
