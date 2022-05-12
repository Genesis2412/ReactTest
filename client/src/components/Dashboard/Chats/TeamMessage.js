import React, { useRef } from "react";
import {
  Attachment,
  Avatar,
  messageHasReactions,
  MessageOptions,
  MessageRepliesCountButton,
  MessageStatus,
  MessageText,
  MessageTimestamp,
  ReactionSelector,
  SimpleReactionsList,
  useMessageContext,
  MessageSimple,
} from "stream-chat-react";

import "./TeamMessage.scss";

const TeamMessage = () => {
  const {
    isReactionEnabled,
    message,
    reactionSelectorRef,
    showDetailedReactions,
  } = useMessageContext();

  const messageWrapperRef = useRef(null);

  const hasReactions = messageHasReactions(message);

  return (
    <div className="message-wrapper">
      <Avatar
        image={message.user?.image}
        name={message.user?.name || message.user?.email}
      />
      <div className="message-wrapper-content">
        <MessageOptions
          displayLeft={false}
          messageWrapperRef={messageWrapperRef}
        />
        <div className="message-header">
          <div className="message-header-name">
            {message.user?.name || message.user?.email}
          </div>
          <div className="message-header-timestamp">
            <MessageTimestamp />
          </div>
        </div>
        {showDetailedReactions && isReactionEnabled && (
          <ReactionSelector ref={reactionSelectorRef} />
        )}
        <MessageText />
        <MessageStatus />
        {message.attachments && (
          <Attachment attachments={message.attachments} />
        )}
        {hasReactions && !showDetailedReactions && isReactionEnabled && (
          <SimpleReactionsList />
        )}
        <MessageRepliesCountButton reply_count={message.reply_count} />
      </div>
    </div>
  );
};

export default TeamMessage;
