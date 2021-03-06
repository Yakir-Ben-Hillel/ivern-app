import {
  Avatar,
  Badge,
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import { makeTime } from './chatRoom';
import { connect } from 'react-redux';
import {
  SetSelectedChatAction,
  SetUnreadChatsAction,
  SetUnreadMessagesAction,
} from '../../../@types/action-types';
import { AppState, Chat } from '../../../@types/types';
import {
  setSelectedChat,
  setUnreadChats,
  startResetUnreadMessages,
} from '../../../redux/actions/userChats';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
interface Props {
  chatsList: Chat[];
  unreadChats: number;
  setSelectedChat: (chat?: Chat) => SetSelectedChatAction;
  startResetUnreadMessages: (cid: string) => Promise<SetUnreadMessagesAction>;
  setUnreadChats: (unreadChats: number) => SetUnreadChatsAction;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(3),
      },
    },
    avatar: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    typography: {
      padding: theme.spacing(2),
    },
    noMessagesTypography: {
      display: 'flex-root',
      marginTop: '40px',
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
    },
    secondaryDetails: {
      marginTop: '7px',
    },
    lastMessage: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    timeTypography: {
      position: 'absolute',
      right: 0,
    },
  })
);
const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      top: 20,
    },
  })
)(Badge);
const ChatsList: React.FC<Props> = ({
  chatsList,
  setSelectedChat,
  setUnreadChats,
  unreadChats,
  startResetUnreadMessages,
}) => {
  const classes = useStyles();
  const handleListItemClick = async (index: number) => {
    if (index !== chatsList.length) {
      if (chatsList[index].unreadMessages > 0) {
        await startResetUnreadMessages(chatsList[index].cid);
        setUnreadChats(unreadChats - 1);
      }
      setSelectedChat(chatsList[index]);
    } else setSelectedChat(undefined);
  };
  const isMessageInEnglish = (text: string) => {
    if (text) {
      const char = text[0].toLocaleLowerCase();
      if (char >= 'a' && char <= 'z') return true;
      else return false;
    } else return false;
  };

  return (
    <div>
      <List className={classes.root}>
        {chatsList.length > 0 ? (
          chatsList.map((chat, index) => (
            <div key={index}>
              <ListItem
                alignItems='flex-start'
                button
                onClick={() => handleListItemClick(index)}
                style={{ marginTop: index === 0 ? 40 : 0 }}
              >
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    src={chat.interlocutor.imageURL}
                    alt=''
                  />
                </ListItemAvatar>
                <ListItemText
                  className={classes.lastMessage}
                  secondaryTypographyProps={{
                    dir:
                      chat.lastMessage?.text &&
                      isMessageInEnglish(chat.lastMessage?.text)
                        ? 'ltr'
                        : 'rtl',
                  }}
                  primary={chat.interlocutor.displayName}
                  secondary={
                    <React.Fragment>
                      {chat.lastMessage?.imageURL &&
                        isMessageInEnglish(chat.lastMessage?.text) && (
                          <PhotoCamera
                            style={{ marginRight: '2px' }}
                            fontSize='inherit'
                          />
                        )}
                      {chat.lastMessage?.text}
                      {chat.lastMessage?.imageURL &&
                        !isMessageInEnglish(chat.lastMessage?.text) && (
                          <PhotoCamera
                            style={{ marginRight: '2px' }}
                            fontSize='inherit'
                          />
                        )}
                    </React.Fragment>
                  }
                />
                <div className={classes.secondaryDetails}>
                  {chat.lastMessage && (
                    <Typography
                      className={classes.timeTypography}
                      variant='caption'
                      color='textSecondary'
                    >
                      {makeTime(chat.lastMessage.createdAt._seconds)}
                    </Typography>
                  )}
                  <StyledBadge
                    badgeContent={chat.unreadMessages}
                    color='secondary'
                  />
                </div>
              </ListItem>
              <Divider variant='inset' component='li' />
            </div>
          ))
        ) : (
          //'https://www.freepik.com/vectors/people' People vector created by rawpixel.com - www.freepik.com
          <div>
            <Typography
              className={classes.noMessagesTypography}
              variant='inherit'
            >
              No chats to show
            </Typography>
            <img
              src={require('./37264.jpg')}
              alt='people chatting'
              width='100%'
              height='100%'
            />
          </div>
        )}
      </List>
    </div>
  );
};
const MapDispatchToProps = {
  setSelectedChat,
  startResetUnreadMessages,
  setUnreadChats,
};
const MapStateToProps = (state: AppState) => ({
  user: state.userInfo.user,
  chatsList: state.userChats.chats,
  unreadChats: state.userChats.unreadChats,
});
export default connect(MapStateToProps, MapDispatchToProps)(ChatsList);
