import { Button, Popconfirm, Table, Space, Input} from 'antd';
import { filter, EditableRow, EditableCell } from './utils/index.js'
import React, { useEffect, useState, useRef } from 'react';
import AppBar from '../../dashboard/appbar/index.js'
import api from '../../service/api.js'
import headers from '../../service/security/header.js'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const UserList = () => {
    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(2);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        api
            .get("/api/user", { headers: headers() })
            .then(response => setDataSource(response.data))

    }, []); 

    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };
    
      const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div
            style={{
              padding: 8,
            }}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined   
            style={{
              color: filtered ? '#1890ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

    const defaultColumns = [
        {
            title: 'Username',
            dataIndex: 'username',
            width: '30%',
            editable: true,
            ...getColumnSearchProps('username'),
            sorter: (a, b) => a.username.localeCompare(b.username),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Role',
            dataIndex: 'adm',
            render: (adm) => `${adm ? 'admin' : 'user'}`,
            filters: [
                {
                    text: 'Admin',
                    value: "admin",
                },
                {
                    text: 'User',
                    value: "user",
                },
            ],
            onFilter: (value, record) => filter(value, record),
            editable: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            editable: true,
            ...getColumnSearchProps('email'),
            sorter: (a, b) => a.username.localeCompare(b.username),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'DELETAR',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a href='/users' style={{color: 'red'}}>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData = {
            key: count,
            username: `edit`,
            role: false,
            email: `edit@gmail.com`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    return (
        <div>
            <AppBar />
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    left: 20
                }}
            >
                Add a row
            </Button>
        </div>
    );
};

export default UserList;