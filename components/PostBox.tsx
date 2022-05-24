import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from 'graphql/mutations'
import client from '@/lib/apollo-client'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from 'graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = { subreddit?: string }

function PostBox({ subreddit }: Props) {
  const { data: session, status } = useSession()
  const [imageBoxOpen, setImageBoxOpen] = useState(false)
  const loading = status === 'loading'
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
    awaitRefetchQueries: true,
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()


  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData)
    const notification = toast.loading('Creating new post...')
    var topic = ''
    if (subreddit != undefined) {
        topic = subreddit
        console.log("No Formdata-> ", subreddit)
    }else{
        topic = formData.subreddit
        console.log("formdata-> ", formData.subreddit)
    }

    try {
      //   query for subreddit topic
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: topic,
        },
      })
      const subredditExists = getSubredditListByTopic.length > 0
      console.log(subredditExists)
      console.log(JSON.stringify(getSubredditListByTopic))
      if (!subredditExists) {
        //create subreddit
        console.log('subreddit is NEW -> creating new subreddit')
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })

        console.log('subreddit created: ', JSON.stringify(newSubreddit))
        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            content: formData.postBody,
            subreddit_id: newSubreddit.id,
            username: session?.user?.name || '',
          },
        })
        console.log('post created: ', newPost)
      } else {
        // Use existing subreddit
        console.log('subreddit exists')
        console.log('subreddit: ',  getSubredditListByTopic[0])
        const subredditData = getSubredditListByTopic[0]
        const image = formData.postImage || ''
        // console.log('formData: ',  formData)
        const {
          data: { insertPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            content: formData.postBody,
            image: image,
            subreddit_id: subredditData.id,
            username: session?.user?.name || '',
          },
        })
        console.log('post created: ', insertPost)
        setValue('postTitle', '')
        setValue('postImage', '')
        setValue('postBody', '')
        setValue('subreddit', '')

        toast.success('Post created!', {
          id: notification,
        })
      }
    } catch (error) {
      toast.error('error', {
        id: notification,
      })
    }
  })

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="sticky top-20 z-50 rounded-md border border-gray-300 bg-white p-2"
      >
        <div className="flex items-center space-x-3">
          {/* AVATAR */}
          <Avatar />
          <input
            {...register('postTitle', { required: true })}
            disabled={!session}
            type={'text'}
            className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
            placeholder={
              session
                ? subreddit
                  ? `Create a post in r/${subreddit}`
                  : 'Post something by creating a title!'
                : 'Sign in to post'
            }
          />
          <PhotographIcon
            onClick={() => setImageBoxOpen(!imageBoxOpen)}
            className={`h-6 cursor-pointer text-gray-300 ${
              imageBoxOpen && 'text-blue-300'
            }`}
          />
          <LinkIcon className="h-6 cursor-pointer text-gray-300" />
        </div>

        {!!watch('postTitle') && (
          <>
            <div className="flex flex-col py-2">
              {/* BODY */}
              <div className="flex items-center px-2">
                <p className="min-w-[90px]">Body</p>
                <input
                  className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                  {...register('postBody')}
                  type="text"
                  placeholder="Text (optional)"
                />
              </div>

              {!subreddit && (
                <div className="flex items-center px-2">
                  <p className="min-w-[90px]">Subreddit</p>
                  <input
                    className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                    {...register('subreddit', { required: true })}
                    type="text"
                    placeholder="i.e. message here"
                  />
                </div>
              )}

              {imageBoxOpen && (
                <div className="flex items-center px-2">
                  <p className="min-w-[90px]">Image URL:</p>
                  <input
                    className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                    {...register('postImage')}
                    type="text"
                    placeholder="Optional Image"
                  />
                </div>
              )}

              {/*  ERRORS */}
              {Object.keys(errors).length > 0 && (
                <div className="space-y-2 p-2 text-red-500">
                  {errors.postTitle?.type === 'required' && (
                    <p className="text-red-500">- A Post Title is required</p>
                  )}
                  {errors.subreddit?.type === 'required' && (
                    <p className="text-red-500">
                      - A Subreddit Title is required
                    </p>
                  )}
                </div>
              )}
              {!!watch('postTitle') && (
                <>
                  <button
                    className="w-full rounded-full bg-blue-400 p-2 text-white"
                    type="submit"
                  >
                    Create Post
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </form>
    </>
  )
}

export default PostBox
