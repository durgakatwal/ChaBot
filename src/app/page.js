
// 'use client'; 
// import { useRouter } from 'next/navigation';
// import Image from 'next/image'; // Next.js optimized image component
// import styles from '/src/app/styles/LandingPage.module.css'; // Importing a separate CSS module for styles

// const LandingPage = () => {
//   const router = useRouter();

//   return (
//     <div className={styles.background}>
//       <div className={styles.container}>
//         <h1 className={styles.title}>Welcome to Registration App</h1>
//         <button onClick={() => router.push('/register')} className={styles.button}>
//           Register
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;





'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
};

export default Home;

