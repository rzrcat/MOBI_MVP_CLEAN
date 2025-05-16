export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          sns_id: string;
          nickname: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sns_id: string;
          nickname: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sns_id?: string;
          nickname?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          status: 'pending' | 'resolved';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          status?: 'pending' | 'resolved';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          status?: 'pending' | 'resolved';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
