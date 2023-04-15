import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion'
import supabase from '@/lib/supabase';
import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/maps.css';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps, router }: AppProps) {
  const session = supabase.auth.session();

  useEffect(() => {
    // Redirect to login if not logged in
    if (!session) router.replace('/login' + (router.pathname === '/login' ? '' : `?redirect=${window.location.pathname}`));
  }, []);

  const variants = {
    out: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.2,
      }
    }
  };

  return (
    <Layout>
      <AnimatePresence
        initial={false}
        mode="wait"
      >
        <motion.div key={router.route} variants={variants}
        animate="in"
        initial="out"
        exit="out">
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
