const users = ['User1', 'User2', 'User3'];

const getUsers = () => [ ...users ];
const addUser = user => users.push(user);

module.exports = {
    getUsers,
    addUser
}
