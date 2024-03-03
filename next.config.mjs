/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qualified-bullfrog-275.convex.cloud'
            }
        ]
    }
};

export default nextConfig;
