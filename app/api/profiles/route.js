import connectDb from '../../../lib/mongoose'; 
import Profile from '../../../models/Profile'; 

export async function GET() {
    try {
        await connectDb();
        const profiles = await Profile.find(); 
        return new Response(JSON.stringify({ success: true, data: profiles }), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDb();

        const { name, skills, experience } = await req.json(); 

        const newProfile = new Profile({ name, skills, experience });
        await newProfile.save();

        return new Response(
            JSON.stringify({ success: true, message: 'Profile created successfully' }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 400 }
        );
    }
}
