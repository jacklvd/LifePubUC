'use client'
import React from 'react'

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8 pb-2 border-b-2 border-green-400 inline-block text-gray-900">
        Account Information
      </h1>

      {/* Profile Photo Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Profile Photo
        </h2>
        <div className="flex justify-center">
          <div className="w-52 h-52 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-4 cursor-pointer hover:border-gray-400 transition-colors">
            <div className="text-3xl text-indigo-600 mb-2">👤</div>
            <div className="text-center text-indigo-600 font-medium">
              ADD A PROFILE
              <br />
              IMAGE
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">
              Drag and drop or choose a file to upload
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Contact Information
        </h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Prefix</label>
          <select className="w-full sm:w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">--</option>
            <option value="mr">Mr.</option>
            <option value="mrs">Mrs.</option>
            <option value="ms">Ms.</option>
            <option value="dr">Dr.</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
