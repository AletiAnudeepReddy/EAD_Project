'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { IoClose, IoMailOutline, IoLockClosedOutline, IoPersonOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';


export default function AuthModal({ isOpen, setIsOpen }) {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);



    const toggleMode = () => {
        setTimeout(() => {
            setIsLogin(!isLogin);
            setFullname('');
            setEmail('');
            setPassword('');
        }, 250);
    };

    const notify = (message, type = 'default') => {
        toast(message, {
            position: 'top-right',
            autoClose: 2000,
            theme: 'colored',
            type,
            transition: Bounce,
        });
    };

    // ✅ handle login/signup integration
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/login' : '/api/signup';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                notify(data.message || 'Something went wrong', 'error');
                setLoading(false);
                return;
            }

            notify(data.message, 'success');

            // ✅ if login: use next-auth to sign in
            if (isLogin) {
                const loginRes = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (loginRes?.ok) {
                    router.push('admin/dashboard'); // redirect after login
                    setIsOpen(false);
                } else {
                    notify('Invalid credentials', 'error');
                }
            } else {
                // after signup, switch to login form
                setIsLogin(true);
            }

            setFullname('');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error(err);
            notify('Error occurred. Try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Google sign-in integration

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            // Let NextAuth handle full redirect flow
            await signIn("google", {
                callbackUrl: `${window.location.origin}/admin/dashboard`,
                prompt: "consent select_account",
            });
            // 👆 After successful Google login, NextAuth will redirect automatically
            // to /admin/dashboard (no manual router.push needed)
        } catch (err) {
            console.error("Google sign-in error:", err);
            notify("Google sign-in failed.", "error");
            setGoogleLoading(false);
        }
    };


    return (
        <>
            <ToastContainer />
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                    {/* Background overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-90"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-90"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl text-gray-800 relative p-8 border-2 border-pink-200">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
                                    >
                                        <IoClose size={22} />
                                    </button>

                                    {/* Title */}
                                    <Dialog.Title className="text-2xl font-bold text-pink-600 mb-6 text-center">
                                        {isLogin ? 'Admin Login 🔐' : 'Create Admin Account'}
                                    </Dialog.Title>

                                    {/* Animated Form */}
                                    <AnimatePresence mode="wait">
                                        <motion.form
                                            key={isLogin ? 'login' : 'signup'}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.4 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-4"
                                        >
                                            {!isLogin && (
                                                <div className="relative">
                                                    <IoPersonOutline className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        value={fullname}
                                                        onChange={(e) => setFullname(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-2 border-pink-200 placeholder-gray-500 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                                                    />
                                                </div>
                                            )}
                                            <div className="relative">
                                                <IoMailOutline className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-2 border-pink-200 placeholder-gray-500 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                                                />
                                            </div>
                                            <div className="relative">
                                                <IoLockClosedOutline className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-2 border-pink-200 placeholder-gray-500 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-2 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold rounded-xl hover:scale-[1.02] transition-transform shadow-md"
                                            >
                                                {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                                            </button>
                                        </motion.form>
                                    </AnimatePresence>

                                    {/* Divider */}
                                    <div className="my-5 flex items-center justify-center gap-3 text-gray-600">
                                        <span className="h-[1.5px] w-16 bg-gray-300" />
                                        or
                                        <span className="h-[1.5px] w-16 bg-gray-300" />
                                    </div>

                                    {/* Continue with Google */}
                                    <button
                                        onClick={handleGoogleSignIn}
                                        disabled={googleLoading}
                                        className={`w-full py-2 border border-pink-200 rounded-xl flex items-center justify-center gap-3 bg-pink-50 shadow-sm hover:scale-[1.01] transition ${googleLoading ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {googleLoading ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" />
                                                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                                                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                                                <span className="text-gray-700 font-medium">Connecting...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <FcGoogle size={22} />
                                                <span className="text-gray-700 font-medium">Continue with Google</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Switch Mode */}
                                    <p className="mt-6 text-sm text-center text-gray-600">
                                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                                        <button onClick={toggleMode} className="text-pink-600 font-semibold hover:underline">
                                            {isLogin ? 'Sign Up' : 'Login'}
                                        </button>
                                    </p>

                                    {/* Glow Effect */}
                                    <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-[18rem] h-[18rem] bg-gradient-to-b from-cyan-300 to-pink-400 rounded-full blur-[80px] opacity-30"></div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
