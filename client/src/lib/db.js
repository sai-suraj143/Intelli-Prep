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
      provider: "password",
      progress: {},
      totalHours: 0,
      streak: 1,
      joinedAt: new Date().toISOString(),
    };
    db.saveUser(newUser);
    return { user: newUser };
  },
  findOrCreateGoogleUser: ({ name, email, picture }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = db.getUsers();
    const existing = users.find((u) => u.email === normalizedEmail);

    if (existing) {
      // Link the Google identity to an existing account instead of creating a duplicate.
      const linkedUser = {
        ...existing,
        provider: existing.provider || "google",
        picture: existing.picture || picture || "",
        name: existing.name || name,
      };
      db.saveUser(linkedUser);
      return linkedUser;
    }

    const newUser = {
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: null,
      provider: "google",
      picture: picture || "",
      progress: {},
      totalHours: 0,
      streak: 1,
      joinedAt: new Date().toISOString(),
    };
    db.saveUser(newUser);
    return newUser;
  },
};
