'use client'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { doLogin } from '@/lib/userCache'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'


export default function Login() {
    const { push } = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const response: any = await dispatch(doLogin(values));
            if (response.payload.message === "success") {
                push('/');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-[var(--bg-secondary)] p-8 shadow-lg shadow-gray-600/50">
                <div>
                    <h1 className="text-3xl font-bold text-center text-[var(--text-primary)]">Login</h1>
                    <p className="mt-2 text-center text-[var(--text-secondary)]">Welcome back!</p>
                </div>

                <Formik initialValues={{
                    email: '',
                    password: ''
                }} validationSchema={Yup.object({
                    email: Yup.string().email('Invalid email address').required('Email is required'),
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required')
                })} onSubmit={handleSubmit}>

                    {({ isSubmitting }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)]">
                                        Email
                                    </label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="formik-field w-full p-2 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500"/>
                                </div>

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
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-800 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="text-center text-sm text-gray-400">
                                Don't have an account?{' '}
                                <Link href="/Auth/Register" className="text-green-500 hover:text-green-400">
                                    Register
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
}
