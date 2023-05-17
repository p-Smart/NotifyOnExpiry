import Head from 'next/head'
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })


export default function Home() {

  return (
    <>
      <Head>
        <title>Home | Notify On Expiry</title>
        <meta name="description" content="Notify On Expiry" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}


export const getServerSideProps = ({req, res}) => {
  return({
    redirect: {
        destination: '/login',
        permanent: false
    }
})
}
