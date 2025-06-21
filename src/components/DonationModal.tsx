
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, QrCode, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'donation' | 'sponsorship';
  investigationTitle?: string;
}

const DonationModal: React.FC<DonationModalProps> = ({ 
  isOpen, 
  onClose, 
  type, 
  investigationTitle 
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const usdtAddress = '0x5d3d904d6a6eb72d95797ad73fe69afa606f74f5';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(usdtAddress);
      setCopied(true);
      toast({
        title: "Address Copied!",
        description: "USDT address has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the address manually.",
        variant: "destructive",
      });
    }
  };

  const generateQRCodeUrl = (address: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {type === 'donation' ? 'Support Our Mission' : 'Sponsor Investigation'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {type === 'sponsorship' && investigationTitle && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Investigation:</p>
              <p className="text-sm text-blue-600">{investigationTitle}</p>
            </div>
          )}
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {type === 'donation' ? 'Donate with USDT (ERC20)' : 'Sponsor with USDT (ERC20)'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {type === 'donation' 
                ? 'Your donation helps us continue our independent journalism'
                : 'Your sponsorship supports in-depth investigative reporting'
              }
            </p>
          </div>

          {!showQR ? (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">USDT (ERC20) Address:</p>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs bg-white p-2 rounded border break-all">
                    {usdtAddress}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={() => setShowQR(true)}
                className="w-full bg-navy-900 hover:bg-navy-800"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Show QR Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <img
                  src={generateQRCodeUrl(usdtAddress)}
                  alt="USDT Address QR Code"
                  className="mx-auto rounded-lg shadow-md"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Scan with your wallet to send USDT (ERC20)
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowQR(false)}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Show Address
              </Button>
            </div>
          )}

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Important:</strong> Only send USDT on the Ethereum network (ERC20). 
              Sending other tokens or using different networks may result in loss of funds.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
