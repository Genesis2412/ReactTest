import React, { useEffect, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Box, Typography } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const ListContainer = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          m: "0px 20px",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "17px",
            color: "#858688",
            mt: "16px",
          }}
        >
          Members
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "17px",
            color: "#858688",
            mt: "16px",
          }}
        >
          Delete
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }
    setSelected((prevSelected) => !prevSelected);
  };
  return (
    <Box
      sx={[
        {
          "&:hover": {
            background: "#f7f6f8",
            cursor: "pointer",
            transition: "0.3s",
          },
          display: "flex",
          alignItems: "center",
          m: "0px 10px",
          p: 1,
          justifyContent: "space-between",
        },
      ]}
      onClick={handleSelect}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 2,
          textAlign: "left",
        }}
      >
        <Avatar
          image={user?.image}
          name={user?.name || user?.email}
          size={32}
        />
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "17px",
            color: "#2c2c30",
            wordBreak: "break-all",
          }}
        >
          {user?.name || user?.first_name}
        </Typography>
      </Box>

      {selected ? (
        <RadioButtonCheckedIcon sx={{ color: "red", fontSize: 30 }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ color: "#45a29e", fontSize: 30 }} />
      )}
    </Box>
  );
};

const UserList = ({ setSelectedUsers }) => {
  const { client, channel } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      if (loading) {
        return;
      }

      try {
        await channel
          .queryMembers({
            user_id: { $ne: client.userID },
          })
          .then((response) => {
            if (response.members.length !== 0) {
              setUsers(response.members);
            } else {
              setListEmpty(true);
            }
          });
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };

    if (client) {
      getUsers();
    }
  }, []);

  if (error) {
    return (
      <ListContainer>
        <Box sx={{ m: 20 }}>
          <Typography sx={{ fontSize: "16px", color: "#2c2c30" }}>
            Error loading, please refresh and try again.
          </Typography>
        </Box>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <Box sx={{ m: 20 }}>
          <Typography sx={{ fontSize: "16px", color: "#2c2c30" }}>
            No members found.
          </Typography>
        </Box>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <Box sx={{ m: 20 }}>
          <Typography sx={{ fontSize: "16px", color: "#2c2c30" }}>
            Loading members...
          </Typography>
        </Box>
      ) : (
        users?.map((user, i) => (
          <UserItem
            index={i}
            key={user.user.id}
            user={user.user}
            setSelectedUsers={setSelectedUsers}
          />
        ))
      )}
    </ListContainer>
  );
};

export default UserList;
