const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 创建数据库连接
const connection = mysql.createConnection({
    host: '121.43.110.193',
    user: 'root', 
    password: '123456', 
    database: 'contact_manager' 
});

// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('成功连接到MySQL数据库');
});

// 添加联系人路由
app.post('/addContact', (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: '姓名和电话号码是必填项' });
    }

    const sql = 'INSERT INTO contacts (name, phone) VALUES (?, ?)';
    connection.query(sql, [name, phone], (err, result) => {
        if (err) {
            console.error('添加联系人时出错:', err);
            return res.status(500).json({ error: '添加联系人失败' });
        }
        res.json({ message: '联系人添加成功' });
    });
});

// 获取联系人列表路由
app.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM contacts';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('获取联系人时出错:', err);
            return res.status(500).json({ error: '获取联系人失败' });
        }
        res.json(results);
    });
});

// 删除联系人路由
app.delete('/deleteContact/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contacts WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('删除联系人时出错:', err);
            return res.status(500).json({ error: '删除联系人失败' });
        }
        res.json({ message: '联系人删除成功' });
    });
});

// 修改联系人路由
app.put('/updateContact/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone } = req.body;
    const sql = 'UPDATE contacts SET name = ?, phone = ? WHERE id = ?';

    connection.query(sql, [name, phone, id], (err, result) => {
        if (err) {
            console.error('修改联系人时出错:', err);
            return res.status(500).json({ error: '修改联系人失败' });
        }
        res.json({ message: '联系人修改成功' });
    });
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在运行，地址为 http://121.43.110.193:${port}`);
});
