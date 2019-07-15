import React, { useState } from "react";
import { Divider, Button, Row } from "antd";
import Search from "./search";
import List from "./listTable";
import ArtForm from "./formModal";
export default function DDArticles() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currId, setCurrId] = useState(null);
  const [retriveValues, setRetriveValues] = useState({ page: 1 });
  const handleModalVisible = (visible = true, currId = null) => {
    setModalVisible(visible);
    setCurrId(currId);
  };
  return (
    <>
      {modalVisible && (
        <ArtForm
          id={currId}
          retriveValues={retriveValues}
          handleModalVisible={handleModalVisible}
        />
      )}
      <Row type="flex" align="middle" justify="space-between">
        <Search updateRetriveValues={setRetriveValues} />
        <Button
          type="primary"
          onClick={() => {
            handleModalVisible();
          }}
        >
          新建
        </Button>
      </Row>

      <Divider />
      <List
        handleModalVisible={handleModalVisible}
        updateRetriveValues={setRetriveValues}
        retriveValues={retriveValues}
      />
    </>
  );
}
