import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import { GET_POST_BY_POST_ID } from 'graphql/queries'
import { ADD_COMMENT } from 'graphql/mutations'
import Post from '@/components/Post'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import Avatar from '@/components/Avatar'
import TimeAgo from 'react-timeago'
import { Jelly } from '@uiball/loaders'

type Props = {
    comment: Comments
  }

function PostPage({}: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, 'getPostListByPostId'],
  })

  const { data } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      post_id: router.query.postId,
    },
  })

  const post: Post = data?.getPostListByPostId

  

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data)
    const notification = toast.loading('Posting your comments...')

    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        comment: data.comment,
      },
    })

    setValue('comment', '')

    toast.success('Comment posted!', {
      id: notification,
    })
  }

  //   console.log(JSON.stringify(data))
  if(!post) return (
    <div className='flex w-full items-center justify-center p-10 text-xl'>
      <Jelly size={50} color="#FF4501" />
    </div>
  )

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />

      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">
          Comment as <span className="text-red-500">{session?.user?.name}</span>{' '}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <textarea
            {...register('comment')}
            disabled={!session}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={session ? 'What are your thoughts?' : 'Please Sign In to comment'}
          />
          <button
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>

        <div className='-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10'>
          <hr className='py-2' />
          {post?.comments.map((comment) => (
            <div className='relative flex items-center space-x-2 space-y-5' key={comment.id}>
              <hr className='absolute top-10 h-16 left-7 border z-0' />
              <div className='z-50'>
                <Avatar seed={comment.username} />
              </div>
              <div className='flex flex-col'>
                  <p className='py-2 text-xs text-gray-400'>
                      <span className='font-semibold text-gray-600'>{comment.username} </span> .{''}
                      <TimeAgo date={comment.created_at} />
                  </p>
                  <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PostPage
