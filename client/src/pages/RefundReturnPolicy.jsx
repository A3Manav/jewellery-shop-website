import {
  ArrowLeft,
  RefreshCw,
  Clock,
  Shield,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function RefundReturnPolicy() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-8">
            <Link
              to="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white hover:bg-amber-500 transition-all duration-300 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 flex items-center">
                <RefreshCw className="w-8 h-8 text-amber-500 mr-3" />
                Refund & Return Policy
              </h1>
              <p className="text-gray-500 mt-2 font-light">
                Your satisfaction is our priority. Learn about our return and
                refund process.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 border-l-4 border-amber-500 p-4">
            <p className="text-gray-700 text-sm flex items-start font-light">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-amber-500" />
              Last Updated: September 21, 2025 | 30-day return window |
              Hassle-free returns for your peace of mind
            </p>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border border-gray-200 p-6 text-center">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              30-Day Returns
            </h3>
            <p className="text-sm text-gray-600 font-light">
              Return items within 30 days of delivery
            </p>
          </div>
          <div className="border border-gray-200 p-6 text-center">
            <Package className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Original Condition
            </h3>
            <p className="text-sm text-gray-600 font-light">
              Items must be unused with all tags
            </p>
          </div>
          <div className="border border-gray-200 p-6 text-center">
            <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Quality Guarantee
            </h3>
            <p className="text-sm text-gray-600 font-light">
              100% satisfaction guaranteed
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-lg max-w-none">
          {/* Section 1: Return Eligibility */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <CheckCircle className="w-6 h-6 text-amber-500 mr-3" />
              1. Return Eligibility
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Eligible Items:</strong> Most
                jewelry items purchased from Abhushan Kala Kendra can be
                returned within 30 days of delivery, provided they are in
                original condition with all tags, certificates, and packaging.
              </p>
              <p>
                <strong className="text-gray-900">
                  Condition Requirements:
                </strong>{" "}
                Items must be unworn, undamaged, and include all original
                accessories such as certificates, gift boxes, and authentication
                papers.
              </p>
              <p>
                <strong className="text-gray-900">Time Limit:</strong> Returns
                must be initiated within 30 days from the delivery date. After
                this period, items cannot be returned for refund or exchange.
              </p>
            </div>
          </div>

          {/* Section 2: Non-Returnable Items */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <XCircle className="w-6 h-6 text-amber-500 mr-3" />
              2. Non-Returnable Items
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">
                  Custom/Personalized Items:
                </strong>{" "}
                Custom-made jewelry, engraved items, or personalized pieces
                cannot be returned unless there is a manufacturing defect.
              </p>
              <p>
                <strong className="text-gray-900">Wedding Orders:</strong>{" "}
                Complete wedding sets (poṭ) and bulk wedding orders are
                non-returnable due to their customized nature and bulk pricing.
              </p>
              <p>
                <strong className="text-gray-900">Damaged/Worn Items:</strong>{" "}
                Items showing signs of wear, damage, or missing components
                cannot be accepted for return.
              </p>
              <p>
                <strong className="text-gray-900">Sale/Clearance Items:</strong>{" "}
                Items purchased during special sales or clearance events may
                have different return policies as specified at the time of
                purchase.
              </p>
            </div>
          </div>

          {/* Section 3: Return Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <RefreshCw className="w-6 h-6 text-amber-500 mr-3" />
              3. Return Process
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Step 1 - Contact Us:</strong>{" "}
                Email us at abhushankalakendra@gmail.com or call +91-7295810660
                to initiate your return request with your order number and
                reason for return.
              </p>
              <p>
                <strong className="text-gray-900">
                  Step 2 - Return Authorization:
                </strong>{" "}
                We will provide you with return instructions and a return
                authorization number within 24 hours.
              </p>
              <p>
                <strong className="text-gray-900">
                  Step 3 - Package Items:
                </strong>{" "}
                Carefully package the items in their original packaging with all
                accessories, certificates, and the return authorization number.
              </p>
              <p>
                <strong className="text-gray-900">Step 4 - Ship Items:</strong>{" "}
                Send the package to the address provided. We recommend using a
                trackable shipping method with insurance for valuable items.
              </p>
            </div>
          </div>

          {/* Section 4: Refund Policy */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Shield className="w-6 h-6 text-amber-500 mr-3" />
              4. Refund Policy
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Processing Time:</strong>{" "}
                Refunds will be processed within 7-10 business days after we
                receive and inspect the returned items.
              </p>
              <p>
                <strong className="text-gray-900">Refund Method:</strong>{" "}
                Refunds will be issued to the original payment method used for
                the purchase. Credit card refunds may take additional 3-5
                business days to appear on your statement.
              </p>
              <p>
                <strong className="text-gray-900">Shipping Costs:</strong>{" "}
                Original shipping charges are non-refundable. Customers are
                responsible for return shipping costs unless the return is due
                to our error.
              </p>
              <p>
                <strong className="text-gray-900">Partial Refunds:</strong> In
                case of damaged or incomplete returns, partial refunds may be
                issued based on the condition of received items.
              </p>
            </div>
          </div>

          {/* Section 5: Exchange Policy */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Package className="w-6 h-6 text-amber-500 mr-3" />
              5. Exchange Policy
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Size Exchanges:</strong> We
                offer size exchanges for rings and bangles within 15 days of
                delivery, subject to availability.
              </p>
              <p>
                <strong className="text-gray-900">Product Exchanges:</strong>{" "}
                Exchanges for different products are subject to price
                differences and availability. Additional charges may apply.
              </p>
              <p>
                <strong className="text-gray-900">One-Time Exchange:</strong>{" "}
                Each item can be exchanged only once. Subsequent changes will be
                processed as returns and new purchases.
              </p>
            </div>
          </div>

          {/* Section 6: Quality Issues */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 mr-3" />
              6. Quality Issues & Defects
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">
                  Manufacturing Defects:
                </strong>{" "}
                Items with manufacturing defects will be replaced or refunded at
                no additional cost, including shipping charges.
              </p>
              <p>
                <strong className="text-gray-900">Quality Guarantee:</strong>{" "}
                All our jewelry comes with a quality guarantee. If you're not
                satisfied with the quality, contact us within 30 days.
              </p>
              <p>
                <strong className="text-gray-900">
                  Damage During Shipping:
                </strong>{" "}
                Items damaged during shipping will be replaced immediately.
                Please report shipping damage within 48 hours of delivery.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12 bg-gray-50 border-l-4 border-amber-500 p-6">
            <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-amber-500 mr-3" />
              Need Help with Returns?
            </h2>
            <div className="space-y-2 text-gray-700 font-light">
              <p>
                <strong className="text-gray-900">Customer Service:</strong>
              </p>
              <p>Email: abhushankalakendra@gmail.com</p>
              <p>Phone: +91-7295810660 (Call/WhatsApp)</p>
              <p>
                Business Hours: Monday-Saturday 10 AM - 8 PM, Sunday 11 AM - 6
                PM
              </p>
            </div>
            <p className="text-gray-600 text-sm mt-4 font-light">
              Our customer service team is here to help make your return process
              as smooth as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundReturnPolicy;
