
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, Shield, AlertTriangle } from 'lucide-react';
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
  
  const usdtAddress = '0x5d3d904d6a6eb72d95797ad73fe69afa606f74f5';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(usdtAddress);
      setCopied(true);
      toast({
        title: "Address Copied! ✅",
        description: "USDT address has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the address manually.",
        variant: "destructive",
      });
    }
  };

  const generateQRCodeUrl = (address: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${address}&bgcolor=ffffff&color=000000&margin=1`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-navy-900 to-blue-700 bg-clip-text text-transparent">
            {type === 'donation' ? '💖 Support Our Mission' : '🎯 Sponsor Investigation'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {type === 'sponsorship' && investigationTitle && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">🔍</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Investigation:</p>
                  <p className="text-sm text-blue-700 leading-relaxed font-medium">{investigationTitle}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">₮</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {type === 'donation' ? 'Donate with USDT (ERC20)' : 'Sponsor with USDT (ERC20)'}
              </h3>
              <p className="text-sm text-gray-600">
                {type === 'donation' 
                  ? 'Your donation helps us continue our independent journalism'
                  : 'Your sponsorship supports in-depth investigative reporting'
                }
              </p>
            </div>

            {/* Address and QR Code Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Address Section */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">USDT (ERC20) Address</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <code className="text-xs font-mono text-gray-800 break-all leading-relaxed">
                      {usdtAddress}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopy}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Address
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm">📱</span>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Scan QR Code</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                    <img
                      src={generateQRCodeUrl(usdtAddress)}
                      alt="USDT Address QR Code"
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg shadow-sm border border-gray-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2 leading-relaxed">
                    Scan with your wallet to send USDT (ERC20)
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Important Security Notice</p>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    <strong>Only send USDT on the Ethereum network (ERC20).</strong> Sending other tokens or using different networks (TRC20, BEP20, etc.) may result in permanent loss of funds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 border-gray-300 hover:bg-gray-50 font-medium"
            >
              Close
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 shadow-md"
            >
              {type === 'donation' ? '💖 Thank You!' : '🎯 Support Investigation'}
            </Button>
          </div>

          {/* Footer Message */}
          <div className="text-center pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Your {type === 'donation' ? 'donation' : 'sponsorship'} helps maintain our independence and quality journalism. Thank you for your support! 🙏
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
