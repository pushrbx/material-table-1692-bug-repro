import React, { useState, useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import update from "immutability-helper";
import { useUpdateEffect, useEffectOnce } from "react-use";
import MaterialTable from "material-table";
import "./style.css";

const categories = {"0":[],"1":[{"priority_number":22,"priority":"Low","site_name":"Winnie","machine_name":"KEL07","component_name":"Bearing","status":"New","diagnostics":"?","inspection":"?","tableData":{"id":0}},{"priority_number":0,"priority":"Normal","site_name":"Winnie","machine_name":"KEL07","component_name":"Bearing","status":"New","diagnostics":"?","inspection":"?","tableData":{"id":1}}],"2":[],"3":[]};

const tabs = [{"id":1,"name":"New","order":1},{"id":2,"name":"Waiting For Inspection","order":2},{"id":3,"name":"Waiting For Replacement","order":3},{"id":0,"name":"Closed","order":0}];

const tableColumns = [
  { title: "#", field: "priority_number" },
  { title: "Priority", field: "priority" },
  { title: "Site", field: "site_name" },
  { title: "Machine", field: "machine_name" },
  { title: "Component", field: "component_name" },
  { title: "Machine Status", field: "status" },
  { title: "Diagnostics", field: "diagnostics" },
  { title: "Inspection", field: "inspection" }
];

function MyTable({
  disableGrouping,
  disableSearch,
  disableSelection,
  statusFilter,
  statuses
}) {
  const [records, setRecords] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const tableOptions = {
    selection: !disableSelection,
    search: !disableSearch,
    grouping: !disableGrouping,
    pageSize: 10
  };
  
  useEffectOnce(() => {
    if (statuses && statuses.length > 0) {
      setRecords(
        update(records, {
          $set: categories[statusFilter]
        })
      );
    }
  });

  useUpdateEffect(() => {
    if (activeCategory !== statusFilter) {
      console.log("uo");
      setRecords(
        update(records, {
          $set: categories[statusFilter]
        })
      );
      setActiveCategory(statusFilter);
    }
  }, [statusFilter]);

  return (
    <MaterialTable
      columns={tableColumns}
      data={records}
      title={null}
      options={tableOptions}
      actions={[]}
      toolbarButtonAlignment="right"
    />
  );
}

MyTable.defaultProps = {
  disableGrouping: false,
  disableSearch: false,
  disableSelection: true,
  itemLimit: 25,
  siteId: null,
  statusFilter: 1
};

export default function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(1);

  function handleTabChange(event, newValue) {
    setSelectedTab(newValue);
    setSelectedStatus(newValue);
  }

  return (
    <div>
      <>
        <AppBar position="static" color="default">
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
          >
            {tabs.map((item, index) => (
              <Tab
                key={item.id}
                tabIndex={index}
                label={item.name}
                title={item.id}
                value={item.id}
              />
            ))}
          </Tabs>
        </AppBar>
        <div role="tabpanel">
          <Box p={1}>
            <MyTable
              statusFilter={selectedStatus}
              disableGrouping={true}
              statuses={tabs}
            />
          </Box>
        </div>
      </>
    </div>
  );
}
