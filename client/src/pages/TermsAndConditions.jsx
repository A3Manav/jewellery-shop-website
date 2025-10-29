import {
  ArrowLeft,
  FileText,
  Shield,
  Clock,
  CreditCard,
  Truck,
  AlertCircle,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

function TermsAndConditions() {
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
                <FileText className="w-8 h-8 text-amber-500 mr-3" />
                Terms & Conditions
              </h1>
              <p className="text-gray-500 mt-2 font-light">
                Please read these terms carefully before using our services
              </p>
            </div>
          </div>
          <div className="bg-gray-50 border-l-4 border-amber-500 p-4">
            <p className="text-gray-700 text-sm flex items-start font-light">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 text-amber-500" />
              Last Updated: September 21, 2025 | By using Abhushan Kala Kendra
              services, you agree to these terms.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="prose prose-lg max-w-none">
          {/* Section 1: Agreement */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Shield className="w-6 h-6 text-amber-500 mr-3" />
              1. Agreement to Terms
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                By accessing and using the Abhushan Kala Kendra website and
                services, you accept and agree to be bound by the terms and
                provision of this agreement.
              </p>
              <p>
                If you do not agree to abide by the above, please do not use
                this service. These terms apply to all visitors, users, and
                others who access or use the service.
              </p>
            </div>
          </div>

          {/* Section 2: Products and Services */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Package className="w-6 h-6 text-amber-500 mr-3" />
              2. Products and Services
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Hallmarked Jewellery:</strong>{" "}
                Abhushan Kala Kendra specializes in hallmarked gold and silver
                jewellery with certified purity and lasting shine. All pieces
                carry our quality guarantee.
              </p>
              <p>
                <strong className="text-gray-900">Wedding Collections:</strong>{" "}
                We offer complete wedding collections, full bridal sets and
                traditional essentials available on order. Wedding orders
                (poṭ/complete sets) are managed with scheduled delivery.
              </p>
              <p>
                <strong className="text-gray-900">
                  Custom Jewelry & Gifts:
                </strong>{" "}
                Personalised designs and gift items made to your specifications
                with skilled artisan craftsmanship.
              </p>
              <p>
                <strong className="text-gray-900">Pricing:</strong> All prices
                are listed in Indian Rupees (₹) with transparent pricing. Delhi
                market rates may affect product pricing based on daily gold and
                silver fluctuations.
              </p>
            </div>
          </div>

          {/* Section 3: Ordering and Payment */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <CreditCard className="w-6 h-6 text-amber-500 mr-3" />
              3. Ordering and Payment
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Order Placement:</strong> By
                placing an order, you offer to purchase a product on and subject
                to the following terms and conditions.
              </p>
              <p>
                <strong className="text-gray-900">Payment Methods:</strong> We
                accept major credit cards, debit cards, net banking, UPI, and
                digital wallets. All payments are processed securely.
              </p>
              <p>
                <strong className="text-gray-900">Order Confirmation:</strong>{" "}
                Receipt of an email order confirmation does not signify our
                acceptance of your order, nor does it constitute confirmation of
                our offer to sell.
              </p>
              <p>
                <strong className="text-gray-900">Pricing Errors:</strong> In
                the event of a pricing error, we reserve the right to cancel the
                order and provide a full refund.
              </p>
            </div>
          </div>

          {/* Section 4: Shipping and Delivery */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Truck className="w-6 h-6 text-amber-500 mr-3" />
              4. Shipping and Delivery
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Delivery Areas:</strong> We
                deliver across India with shipping charges calculated at
                checkout based on location and order value.
              </p>
              <p>
                <strong className="text-gray-900">Processing Time:</strong>{" "}
                Orders are typically processed within 2-3 business days. Custom
                orders may require additional time.
              </p>
              <p>
                <strong className="text-gray-900">Delivery Time:</strong>{" "}
                Standard delivery takes 5-7 business days. Express delivery
                options available for urgent orders.
              </p>
              <p>
                <strong className="text-gray-900">Packaging:</strong> All
                jewelry is carefully packaged with proper security features and
                insurance for safe delivery.
              </p>
            </div>
          </div>

          {/* Section 5: Returns and Exchanges */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Clock className="w-6 h-6 text-amber-500 mr-3" />
              5. Returns and Exchanges
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Return Period:</strong> Items
                may be returned within 30 days of delivery in original condition
                with all tags and certificates.
              </p>
              <p>
                <strong className="text-gray-900">Custom Orders:</strong>{" "}
                Custom-made jewelry and personalized items cannot be returned
                unless there is a manufacturing defect.
              </p>
              <p>
                <strong className="text-gray-900">Return Process:</strong>{" "}
                Contact our customer service team to initiate a return. Items
                must be returned in original packaging with all accessories.
              </p>
              <p>
                <strong className="text-gray-900">Refund Processing:</strong>{" "}
                Refunds will be processed within 7-10 business days after we
                receive and inspect the returned item.
              </p>
            </div>
          </div>

          {/* Section 6: Privacy and Security */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <Shield className="w-6 h-6 text-amber-500 mr-3" />
              6. Privacy and Security
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                <strong className="text-gray-900">Data Protection:</strong> We
                are committed to protecting your personal information and use it
                only for order processing and customer service.
              </p>
              <p>
                <strong className="text-gray-900">Secure Transactions:</strong>{" "}
                All payment transactions are encrypted and processed through
                secure payment gateways.
              </p>
              <p>
                <strong className="text-gray-900">Communication:</strong> We may
                contact you regarding your orders, new products, or service
                updates using the information you provide.
              </p>
            </div>
          </div>

          {/* Section 7: Limitation of Liability */}
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center border-b border-gray-200 pb-3">
              <AlertCircle className="w-6 h-6 text-amber-500 mr-3" />
              7. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-700 font-light leading-relaxed">
              <p>
                Abhushan Kala Kendra shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages
                resulting from your use of our services.
              </p>
              <p>
                Our liability is limited to the purchase price of the product in
                question. We make no warranties regarding the availability,
                reliability, or accuracy of our services.
              </p>
            </div>
          </div>

          {/* Section 8: Contact Information */}
          <div className="mb-12 bg-gray-50 border-l-4 border-amber-500 p-6">
            <h2 className="text-2xl font-light text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 text-amber-500 mr-3" />
              Contact Information
            </h2>
            <div className="space-y-2 text-gray-700 font-light">
              <p>
                <strong className="text-gray-900">Abhushan Kala Kendra</strong>
              </p>
              <p>At- Samhauta Bazar, P.O- Bhabhata</p>
              <p>Via- Chanpatia, West Champaran, Bihar – 845449</p>
              <p>Phone: +91-7295810660</p>
              <p>Email: abhushankalakendra@gmail.com</p>
            </div>
            <p className="text-gray-600 text-sm mt-4 font-light">
              For any questions regarding these terms and conditions, please
              contact us using the information above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
