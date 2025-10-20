import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req) {
    try {
        await connectDB()
        const { fullname, email, password } = await req.json()

        if (!fullname || !email || !password) {
            return new Response(JSON.stringify({ message: 'All fields are required' }), {
                status: 400,
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), {
                status: 409,
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        })

        await newUser.save()

        return new Response(
            JSON.stringify({
                message: 'Signup successful',
                user: {
                    name: newUser.fullname,
                    email: newUser.email,
                },
            }),
            { status: 201 }
        )
    } catch (error) {
        console.error('Signup error:', error)
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
        })
    }
}
