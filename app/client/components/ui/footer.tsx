import Link from 'next/link'
import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="w-full">
      {/* Newsletter section */}
      <div className="bg-blue-100 py-6 text-center">
        <p className="text-base mb-4">
          Yes! Send me exclusive offers, unique gift ideas, and personalized
          tips for shopping and selling on LifePub.
        </p>
        <Link
          href="#"
          className="inline-block border-2 border-gray-800 rounded-full px-5 py-2 text-base hover:bg-gray-100 transition-colors"
        >
          Subscribe
        </Link>
      </div>

      {/* Renewable energy section */}
      <div className="bg-blue-600 py-5 text-center text-white">
        <div className="inline-flex items-center">
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <Link href="#" className="underline">
            LifePub is powered by 100% renewable electricity.
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-blue-900 text-white py-10">
        <div className="container mx-auto px-5 flex flex-col md:flex-row">
          {/* Logo and app download */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <Link
              href="#"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              Download the LifePub App
            </Link>
          </div>

          {/* Footer links */}
          <div className="w-full md:w-3/4 flex flex-wrap md:flex-nowrap">
            {/* Shop column */}
            <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Gift cards
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    LifePub Registry
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Sitemap
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    LifePub blog
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    LifePub United Kingdom
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    LifePub Germany
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    LifePub Canada
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sell column */}
            <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-4">Sell</h3>
              <ul>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Sell on LifePub
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Teams
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Forums
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Affiliates & Creators
                  </Link>
                </li>
              </ul>
            </div>

            {/* About column */}
            <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-4">About</h3>
              <ul>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    LifePub, Inc.
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Policies
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Investors
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Careers
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Press
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Impact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help column */}
            <div className="w-1/2 md:w-1/4">
              <h3 className="text-lg font-bold mb-4">Help</h3>
              <ul>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Help Center
                  </Link>
                </li>
                <li className="mb-3">
                  <Link href="#" className="hover:underline">
                    Privacy settings
                  </Link>
                </li>
              </ul>
              <div className="flex gap-4 mt-4">
                <Link href="#" aria-label="Instagram">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-blue-900">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
                      <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                    </svg>
                  </div>
                </Link>
                <Link href="#" aria-label="Facebook">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-blue-900">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                </Link>
                <Link href="#" aria-label="Pinterest">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-blue-900">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                    </svg>
                  </div>
                </Link>
                <Link href="#" aria-label="YouTube">
                  <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-blue-900">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-blue-950 text-white py-4">
        <div className="container mx-auto px-5 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-5 h-4 bg-gray-200 rounded mr-2"></div>
            <span className="text-sm">
              United States | English (US) | $ (USD)
            </span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end text-sm">
            <span className="mr-4">© 2025 LifePub, Inc.</span>
            <Link href="#" className="mx-2 hover:underline">
              Terms of Use
            </Link>
            <Link href="#" className="mx-2 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="mx-2 hover:underline">
              Interest-based ads
            </Link>
            <Link href="#" className="mx-2 hover:underline">
              Local Shops
            </Link>
            <Link href="#" className="mx-2 hover:underline">
              Regions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
