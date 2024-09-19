import { DATABASE_USER } from "@/app/utils/constant";
import { USER_COLUMNS } from "@/app/utils/databaseSchema";
import { supabaseAdmin } from "@/app/utils/supabaseClient";
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async session({ session, token }) {

      const { data, error } = await supabaseAdmin
        .from(DATABASE_USER)
        .select(USER_COLUMNS.ROLE)
        .eq(USER_COLUMNS.EMAIL, session.user.email)
        .single();

      if (error) {
        session.role = null; // Role not found, ask the user for their role
      } else {
        session.role = data.role;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
