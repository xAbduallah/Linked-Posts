'use client'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {

    const { push } = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const initialValues = {
        name: '',
        email: '',
        password: '',
        rePassword: '',
        dateOfBirth: '',
        gender: 'male'
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Name must be at least 2 characters')
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        rePassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Please confirm your password'),
        dateOfBirth: Yup.date()
            .max(new Date(), 'Date of birth cannot be in the future')
            .required('Date of birth is required'),
        gender: Yup.string()
            .oneOf(['male', 'female'], 'Please select a valid gender')
            .required('Gender is required')
    });

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            setIsLoading(true);
            axios.post('https://linked-posts.routemisr.com/users/signup', values)
                .then((res) => {
                    if (res.data.message === "success") {
                        push('/Login');
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-[var(--bg-secondary)] p-8 shadow-lg shadow-gray-600/50">
                <div>
                    <h1 className="text-3xl font-bold text-center text-white">Register</h1>
                    <p className="mt-2 text-center text-gray-400">Create your account</p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                        Name
                                    </label>
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="formik-field w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg"
                                        placeholder="Enter your name"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="mt-1 text-sm text-red-500"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        Email
                                    </label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="formik-field w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="mt-1 text-sm text-red-500"
                                    />
                                </div>

                                {/* Password Fields */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="formik-field w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg"
                                        placeholder="Enter your password"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="mt-1 text-sm text-red-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="rePassword" className="block text-sm font-medium text-gray-300">
                                        Confirm Password
                                    </label>
                                    <Field
                                        id="rePassword"
                                        name="rePassword"
                                        type="password"
                                        className="formik-field w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg"
                                        placeholder="Confirm your password"
                                    />
                                    <ErrorMessage
                                        name="rePassword"
                                        component="div"
                                        className="mt-1 text-sm text-red-500"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
                                        Date of Birth
                                    </label>
                                    <Field
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        className="formik-field w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg"
                                    />
                                    <ErrorMessage
                                        name="dateOfBirth"
                                        component="div"
                                        className="mt-1 text-sm text-red-500"
                                    />
                                </div>

                                {/* Gender Selection */}
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                                        Gender
                                    </label>
                                    <Field
                                        as="select"
                                        id="gender"
                                        name="gender"
                                        value="Male"
                                        className="formik-field w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </Field>
                                    <ErrorMessage
                                        name="gender"
                                        component="div"
                                        className="mt-1 text-sm text-red-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex justify-center items-center gap-5 w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-800 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating Account...' : 'Register'}

                                {isLoading && <div className="flex justify-center items-center">
                                    <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                </div>}
                            </button>
                            

                            <div className="text-center text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link href="/Auth/Login" className="text-green-500 hover:text-green-400">
                                    Login here
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
}
