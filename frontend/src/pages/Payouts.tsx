import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContextNew';
import { DollarSign, Wallet, RefreshCw } from 'lucide-react';

type Payout = {
  id: string;
  orderId: string;
  amountKobo: number;
  beneficiaryType: string;
  status: string;
  createdAt: string;
  paystackTransferCode?: string | null;
  failureReason?: string | null;
};

const Payouts = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [beneficiaryFilter, setBeneficiaryFilter] = useState<string>('all');

  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [walletMessage, setWalletMessage] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const canSetupWallet = user?.role === 'farmer' || user?.role === 'supplier' || user?.role === 'logistics';

  const formatAmount = (amountKobo: number) => {
    const amount = (amountKobo || 0) / 100;
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  const loadPayouts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPayouts({
        status: statusFilter === 'all' ? undefined : statusFilter,
        beneficiaryType: beneficiaryFilter === 'all' ? undefined : beneficiaryFilter
      });
      setPayouts((response?.data as Payout[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load payouts';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [beneficiaryFilter, statusFilter]);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const payoutStats = useMemo(() => {
    const total = payouts.length;
    const sent = payouts.filter((p) => p.status === 'sent').length;
    const queued = payouts.filter((p) => p.status === 'queued').length;
    const failed = payouts.filter((p) => p.status === 'failed').length;
    return { total, sent, queued, failed };
  }, [payouts]);

  const handleWalletSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSetupWallet) return;

    try {
      setWalletLoading(true);
      setWalletMessage(null);
      setWalletError(null);
      const response = await apiService.createPaystackRecipientSelf({
        name: accountName,
        accountNumber,
        bankCode
      });
      const recipientCode = (response as { data?: { recipientCode?: string } }).data?.recipientCode;
      setWalletMessage(recipientCode ? `Recipient saved: ${recipientCode}` : 'Recipient saved successfully');
      setAccountName('');
      setAccountNumber('');
      setBankCode('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save payout wallet';
      setWalletError(message);
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Payouts & Wallet</h1>
              <p className="text-muted-foreground">Track escrow releases and manage your payout wallet.</p>
            </div>
            <Button variant="outline" onClick={loadPayouts} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total payouts</p>
                <p className="text-2xl font-bold">{payoutStats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold text-emerald-600">{payoutStats.sent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Queued</p>
              <p className="text-2xl font-bold text-amber-600">{payoutStats.queued}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-red-600">{payoutStats.failed}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Payout history</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={beneficiaryFilter} onValueChange={setBeneficiaryFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Beneficiary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading payouts...</p>
              ) : payouts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payouts found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transfer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => {
                      const statusVariant: 'default' | 'destructive' | 'secondary' =
                        payout.status === 'sent'
                          ? 'default'
                          : payout.status === 'failed'
                          ? 'destructive'
                          : 'secondary';

                      return (
                        <TableRow key={payout.id}>
                          <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{formatAmount(payout.amountKobo)}</TableCell>
                          <TableCell className="capitalize">{payout.beneficiaryType}</TableCell>
                          <TableCell>
                            <Badge variant={statusVariant}>{payout.status}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {payout.paystackTransferCode || payout.failureReason || '--'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!canSetupWallet ? (
                <p className="text-sm text-muted-foreground">Wallet setup is available to sellers and logistics providers.</p>
              ) : (
                <form onSubmit={handleWalletSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="accountName">Account name</Label>
                    <Input
                      id="accountName"
                      value={accountName}
                      onChange={(event) => setAccountName(event.target.value)}
                      placeholder="Business or personal name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account number</Label>
                    <Input
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(event) => setAccountNumber(event.target.value)}
                      placeholder="0123456789"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankCode">Bank code</Label>
                    <Input
                      id="bankCode"
                      value={bankCode}
                      onChange={(event) => setBankCode(event.target.value)}
                      placeholder="Paystack bank code"
                      required
                    />
                  </div>
                  {walletMessage && <p className="text-sm text-emerald-600">{walletMessage}</p>}
                  {walletError && <p className="text-sm text-red-600">{walletError}</p>}
                  <Button type="submit" disabled={walletLoading} className="w-full">
                    {walletLoading ? 'Saving...' : 'Save payout wallet'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payouts;
