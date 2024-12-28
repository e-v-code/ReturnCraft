import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("받은 데이터:", body);

    const { email, password, name, gender, age } = body;

    console.log({
      email,
      password: password ? "있음" : "없음",
      name,
      gender,
      age
    });

    // 필수 필드 검증
    if (!email || !password || !name || !gender || !age) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');
      if (!name) missingFields.push('name');
      if (!gender) missingFields.push('gender');
      if (!age) missingFields.push('age');

      return NextResponse.json(
        { 
          message: "필수 정보가 누락되었습니다.",
          missingFields: missingFields 
        },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const [newUser] = await db.insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        gender,
        age,
        created_at: new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })
        ),
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    // 세션 생성
    const session = await getServerSession(authOptions);
    if (session) {
      session.user = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };
    }

    return NextResponse.json(
      { 
        message: "회원가입이 완료되었습니다.", 
        user: newUser,
        session: session 
      },
      { 
        status: 201,
        headers: {
          'Set-Cookie': `session=${JSON.stringify(session)}; Path=/; HttpOnly; Secure; SameSite=Strict`
        }
      }
    );

  } catch (error) {
    console.error("회원가입 에러:", error);
    return NextResponse.json(
      { message: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
