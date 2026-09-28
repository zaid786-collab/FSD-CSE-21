const express = require("express");

const app = express();

app.use(express.json());


let users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" }
];


app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const userId = Number(id);

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }


    const [deletedUser] = users.splice(userIndex, 1);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser
    });

  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});