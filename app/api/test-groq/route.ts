import { NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  
  console.log('🔍 Testing Groq API Key');
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  console.log('API Key preview:', apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 'NONE');
  
  if (!apiKey || apiKey === 'gsk_DUMMY_KEY_REPLACE_WITH_REAL_ONE') {
    return NextResponse.json({
      success: false,
      error: 'GROQ_API_KEY not configured properly',
      message: 'Please set GROQ_API_KEY in .env.local'
    }, { status: 500 });
  }
  
  // Test actual API call
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello" in JSON format: {"message": "Hello"}'
          }
        ],
        max_tokens: 50,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API Test Failed:', response.status, errorText);
      
      return NextResponse.json({
        success: false,
        error: `Groq API returned ${response.status}`,
        details: errorText
      }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('✅ Groq API Test Successful');
    
    return NextResponse.json({
      success: true,
      message: 'Groq API is working properly!',
      response: data.choices[0]?.message?.content
    });
    
  } catch (error: any) {
    console.error('❌ Groq API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to connect to Groq API'
    }, { status: 500 });
  }
}
