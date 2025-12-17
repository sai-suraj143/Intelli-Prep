export const db = {
  getUsers: () => JSON.parse(localStorage.getItem("intelli_users") || "[]"),
  saveUser: (user) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex((u) => u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem("intelli_users", JSON.stringify(users));
  },
  findUser: (email, password) => {
    const users = db.getUsers();
    return users.find((u) => u.email === email && u.password === password);
  },
  register: (name, email, password) => {
    const users = db.getUsers();
    if (users.find((u) => u.email === email))
      return { error: "User already exists" };

    const newUser = {
      name,
      email,
      password,
      progress: {},
      totalHours: 0,
      streak: 1,
      joinedAt: new Date().toISOString(),
    };
    db.saveUser(newUser);
    return { user: newUser };
  },
};
