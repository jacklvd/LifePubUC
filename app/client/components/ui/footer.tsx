import Link from 'next/link'
import { FC } from 'react'

const Footer: FC = () => {
  return (
    <footer className="w-full bottom-0 fixed">
      {/* Renewable energy section */}
      <div className="bg-gradient-to-r from-blue-200 to-blue-300 py-4 text-center text-white shadow-md">
        <div className="container mx-auto px-5">
          <div className="inline-flex items-center transition-transform hover:scale-105">
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
            <Link href="#" className="text-white font-medium hover:underline">
              LifePub is powered by 100% renewable electricity.
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      {/* <div className="bg-blue-400 text-white py-12 shadow-inner">
        <div className="container mx-auto px-5 flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-10 md:mb-0 flex flex-col items-start">
            <div className="text-2xl font-bold mb-6">LifePub</div>
            <Link
              href="#"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Download our App
              </div>
            </Link>
          </div>

          <div className="w-full md:w-3/4 flex flex-wrap md:flex-nowrap gap-8">
            <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">
                Shop
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Gift cards
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> LifePub Registry
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Sitemap
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> LifePub blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> United Kingdom
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Germany
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Canada
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">
                Sell
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Sell on LifePub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Teams
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Forums
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Affiliates & Creators
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-1/2 md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">
                About
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> LifePub, Inc.
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Policies
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Investors
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Press
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Impact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="w-1/2 md:w-1/4">
              <h3 className="text-lg font-bold mb-4 border-b border-blue-700 pb-2">
                Help
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-300 transition-colors flex items-center"
                  >
                    <span className="mr-1">→</span> Privacy settings
                  </Link>
                </li>
              </ul>

              <h4 className="text-base font-semibold mt-6 mb-3">Follow us</h4>
              <div className="flex gap-3">
                <Link href="#" aria-label="Instagram">
                  <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-blue-900 hover:bg-blue-100 transition-colors duration-300 hover:shadow-md">
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
                  <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-blue-900 hover:bg-blue-100 transition-colors duration-300 hover:shadow-md">
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
                  <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-blue-900 hover:bg-blue-100 transition-colors duration-300 hover:shadow-md">
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
                  <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-blue-900 hover:bg-blue-100 transition-colors duration-300 hover:shadow-md">
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
      </div> */}

      {/* Bottom footer */}
      <div className="bg-blue-500 text-white py-5">
        <div className="container mx-auto px-5">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                <span className="text-sm">
                  United States | English (US) | $ (USD)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end text-sm space-x-4">
              <span className="text-white-100">© 2025 LifePub, Inc.</span>
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Terms of Use
              </Link>
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Interest-based ads
              </Link>
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Local Shops
              </Link>
              <Link href="#" className="hover:text-blue-300 transition-colors">
                Regions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
