import { gql } from '@apollo/client'

export const GET_SUBREDDIT_WITH_LIMIT = gql`
  query TopicQuery($limit: Int!) {
    getSubredditListLimit(limit: $limit) {
      id
      topic
      created_at
    }
  }
`

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query VoteQuery($post_id: ID!) {
    getVotesByPostId(post_id: $post_id) {
      id
      created_at
      post_id
      username
      upvote
    }
  }
`

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query TopicQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`

export const GET_POST_BY_POST_ID = gql`
  query PostQuery($post_id: ID!) {
    getPostListByPostId(post_id: $post_id) {
      id
      title
      content
      created_at
      image
      video
      link
      subreddit_id
      username
      user_id
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
      comments {
        comment
        created_at
        id
        post_id
        title
        updated_at
        user_id
        username
      }
    }
  }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query AllPostByTopicQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      content
      created_at
      id
      link
      subreddit_id
      title
      user_id
      username
      subreddit {
        created_at
        id
        topic
      }
      votes {
        created_at
        id
        post_id
        upvote
        username
      }
      comments {
        comment
        created_at
        id
        post_id
        title
        updated_at
        user_id
        username
      }
    }
  }
`
export const GET_ALL_POSTS = gql`
  query AllPostQuery {
    getPostList {
      content
      created_at
      id
      image
      link
      subreddit_id
      title
      user_id
      username
      video
      comments {
        comment
        id
        post_id
        title
        updated_at
        user_id
        username
        created_at
      }
      subreddit {
        topic
        id
        created_at
      }
      votes {
        id
        post_id
        upvote
        username
        created_at
      }
    }
  }
`
