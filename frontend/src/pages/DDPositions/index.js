import React, { useState } from "react";
import { Divider, Button } from "antd";
import List from "./listTable";
import PosForm from "./formModal";
export default function DDPositions() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currId, setCurrId] = useState(null);
  const handleModalVisible = (visible = true, currId = null) => {
    setModalVisible(visible);
    setCurrId(currId);
  };
  return (
    <>
      {modalVisible && (
        <PosForm id={currId} handleModalVisible={handleModalVisible} />
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
