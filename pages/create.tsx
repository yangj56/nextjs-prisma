import React, { useRef, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { postSchema } from '../schema/post';

const Draft: React.FC = () => {
  const title = useRef<string>();
  const authorEmail = useRef<string>();
  const content = useRef<string>();

  // const [authorEmail, setAuthorEmail] = useState('test');
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {
        title: title.current,
        content: content.current,
        authorEmail: authorEmail.current,
      };
      const response = postSchema.safeParse(body);
      if (!response.success) {
        return;
      }
      await fetch(`http://localhost:3000/api/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>Create Draft</h1>
          <input
            autoFocus
            onChange={(e) => (title.current = e.target.value)}
            placeholder="Title"
            type="text"
            value={title.current}
          />
          <input
            onChange={(e) => (authorEmail.current = e.target.value)}
            placeholder="Author (email address)"
            type="text"
            value={authorEmail.current}
          />
          <textarea
            cols={50}
            onChange={(e) => (content.current = e.target.value)}
            placeholder="Content"
            rows={8}
            value={content.current}
          />
          <input
            disabled={!content || !title || !authorEmail}
            type="submit"
            value="Create"
          />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
          cursor: pointer;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
