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
    const { form, updateRetriveValues } = this.props;

    return (
      <Form layout="inline" onSubmit={this.handleFormSubmit}>
        <Item>
          {form.getFieldDecorator("name")(<Input placeholder="用户名" />)}
        </Item>
        <Item>
          {form.getFieldDecorator("type")(
            <Select placeholder="用户类型" style={{ width: 100 }}>
              <Option value="1">管理员</Option>
              <Option value="2">运营</Option>
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
              updateRetriveValues({ page: 1 });
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
