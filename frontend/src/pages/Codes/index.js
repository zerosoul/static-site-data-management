import React, { useState } from "react";
import { Divider, Button } from "antd";
import List from "./listTable";
import CodeForm from "./formModal";
export default function Codes() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currId, setCurrId] = useState(null);
  const handleModalVisible = (visible = true, currId = null) => {
    console.log("curr id", currId);

    setModalVisible(visible);
    setCurrId(currId);
  };
  return (
    <>
      {modalVisible && (
        <CodeForm id={currId} handleModalVisible={handleModalVisible} />
      )}
      <Button
        type="primary"
        onClick={() => {
          handleModalVisible();
        }}
      >
        新建
      </Button>
      <Divider />
      <List handleModalVisible={handleModalVisible} />
    </>
  );
}
