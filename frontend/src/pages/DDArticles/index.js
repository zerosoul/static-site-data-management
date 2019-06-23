import React, { useState } from "react";
import { Divider, Button } from "antd";
import List from "./listTable";
import ArtForm from "./formModal";
export default function DDArticles() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleModalVisible = (visible = true) => {
    setModalVisible(visible);
    if (modalVisible && visible === false) {
      setRefresh(true);
    } else {
      setRefresh(false);
    }
  };
  return (
    <>
      {modalVisible && <ArtForm handleModalVisible={handleModalVisible} />}
      <Button
        type="primary"
        onClick={() => {
          handleModalVisible();
        }}
      >
        新建
      </Button>
      <Divider />
      <List refresh={refresh} handleModalVisible={handleModalVisible} />
    </>
  );
}
