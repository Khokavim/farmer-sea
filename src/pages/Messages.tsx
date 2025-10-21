import MessageList from '@/components/messaging/MessageList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Messages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MessageList />
      <Footer />
    </div>
  );
};

export default Messages;
