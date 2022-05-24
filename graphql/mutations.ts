import { gql } from '@apollo/client'

export const ADD_POST = gql`
  mutation PostMutation(
    $title: String!
    $content: String!
    $link: String
    $image: String
    $subreddit_id: ID!
    $username: String
  ) {
    insertPost(
      title: $title
      content: $content
      link: $link
      image: $image
      subreddit_id: $subreddit_id
      username: $username
    ) {
    title
    content
    created_at
    id
    image
    video
    link
    subreddit_id
    username
    user_id
  }
  }
`

export const ADD_SUBREDDIT = gql`
  mutation SubredditAddMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      topic
      created_at
    }
  }
`

export const ADD_VOTE = gql`
  mutation VoteMutation($post_id: ID!, $username: String!, $upvote: Boolean! ) {
    insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
        created_at
        id
        post_id
        upvote
        username
    }
  }
`

export const ADD_COMMENT = gql`
  mutation CommentMutation($post_id: ID!, $username: String!, $comment: String! ) {
    insertComment(post_id: $post_id, comment: $comment, username: $username) {
        created_at
        id
        post_id
        comment
        username
    }
  }
`
