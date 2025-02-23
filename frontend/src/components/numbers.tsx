export function Numbers() {
  return (
    <section
      id="about"
      className="w-full py-24 bg-gradient-to-br from-yellow-50 via-green-50 to-emerald-100"
    >
      <div className="container mx-auto px-4 md:px-16">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
            What We've Achieved
          </h2>
          <p className="text-gray-600 text-lg">
            HelpHive in Numbers: Tracking Our Impact, Volunteer Growth, and
            Community Connections
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Opportunities Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-100/50 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-3">
              200+
            </div>
            <p className="text-gray-600">up to date opportunities available.</p>
          </div>

          {/* Impact Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-100/50 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-3">
              10,000+
            </div>
            <p className="text-gray-600">volunteer hours contributed.</p>
          </div>

          {/* Success Rate Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg shadow-emerald-100/50 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-3">
              95%
            </div>
            <p className="text-gray-600">accuracy in matching volunteers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
