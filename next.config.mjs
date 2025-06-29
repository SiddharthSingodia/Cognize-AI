/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
    ],
    domains: [
      'www.google.com', 
      'encrypted-tbn0.gstatic.com', 
      'yt3.googleusercontent.com', 
      'pbs.twimg.com',
      'takeuforward-content-images.s3.ap-south-1.amazonaws.com',
      'images.unsplash.com',
      'cdn.pixabay.com',
      'via.placeholder.com'
    ],
  },
};

export default nextConfig;